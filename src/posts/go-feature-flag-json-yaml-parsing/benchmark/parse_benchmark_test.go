package benchmark

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"strings"
	"testing"

	"gopkg.in/yaml.v3"
)

var (
	payloadPath = flag.String("payload", "", "JSON feature flag payload; generated when omitted")
	flagCount   = flag.Int("flags", 100, "number of flags in the generated payload")
	payloadSize = flag.Int("bytes", 0, "target size of the generated payload")
	decodedSink map[string]flagDTO
)

type flagDTO struct {
	Variations  map[string]any `json:"variations" yaml:"variations"`
	Targeting   []ruleDTO      `json:"targeting" yaml:"targeting"`
	DefaultRule ruleDTO        `json:"defaultRule" yaml:"defaultRule"`
	Metadata    map[string]any `json:"metadata" yaml:"metadata"`
}

type ruleDTO struct {
	Name       string             `json:"name,omitempty" yaml:"name,omitempty"`
	Query      string             `json:"query,omitempty" yaml:"query,omitempty"`
	Variation  string             `json:"variation,omitempty" yaml:"variation,omitempty"`
	Percentage map[string]float64 `json:"percentage,omitempty" yaml:"percentage,omitempty"`
}

func TestJSONPayloadDecodesWithBothParsers(t *testing.T) {
	payload := benchmarkPayload(t)
	var flags map[string]json.RawMessage
	if err := json.Unmarshal(payload, &flags); err != nil {
		t.Fatal(err)
	}
	t.Logf("payload: flags=%d bytes=%d", len(flags), len(payload))
	if err := assertEquivalentDecoding(payload); err != nil {
		t.Fatal(err)
	}
}

func BenchmarkDecode(b *testing.B) {
	payload := benchmarkPayload(b)
	var flags map[string]json.RawMessage
	if err := json.Unmarshal(payload, &flags); err != nil {
		b.Fatal(err)
	}

	for name, decode := range map[string]func([]byte, any) error{
		"json": json.Unmarshal,
		"yaml": yaml.Unmarshal,
	} {
		b.Run(name, func(b *testing.B) {
			b.ReportAllocs()
			b.SetBytes(int64(len(payload)))

			var decoded map[string]flagDTO
			for b.Loop() {
				decoded = nil
				if err := decode(payload, &decoded); err != nil {
					b.Fatal(err)
				}
			}
			decodedSink = decoded
			b.ReportMetric(float64(len(flags)), "flags/op")
		})
	}
}

// ponytail: matches flag count and bytes only; add rule/variation distribution if parser shape becomes material.
func benchmarkPayload(tb testing.TB) []byte {
	tb.Helper()
	if *payloadPath != "" {
		payload, err := os.ReadFile(*payloadPath)
		if err != nil {
			tb.Fatal(err)
		}
		return payload
	}
	if *flagCount < 1 {
		tb.Fatal("-flags must be greater than zero")
	}

	flags := make(map[string]flagDTO, *flagCount)
	for i := range *flagCount {
		metadata := map[string]any{"owner": "example", "revision": i}
		if i == 0 {
			metadata["padding"] = ""
		}
		flags[fmt.Sprintf("feature-%04d", i)] = flagDTO{
			Variations: map[string]any{"enabled": true, "disabled": false},
			Targeting: []ruleDTO{{
				Name:       "gradual-rollout",
				Query:      `country eq "KR"`,
				Percentage: map[string]float64{"enabled": 50, "disabled": 50},
			}},
			DefaultRule: ruleDTO{Variation: "disabled"},
			Metadata:    metadata,
		}
	}
	payload, err := json.Marshal(flags)
	if err != nil {
		tb.Fatal(err)
	}
	if *payloadSize > 0 {
		if *payloadSize < len(payload) {
			tb.Fatalf("-bytes %d is smaller than the generated payload %d; reduce -flags", *payloadSize, len(payload))
		}
		first := flags["feature-0000"]
		first.Metadata["padding"] = strings.Repeat("x", *payloadSize-len(payload))
		flags["feature-0000"] = first
		payload, err = json.Marshal(flags)
		if err != nil {
			tb.Fatal(err)
		}
	}
	return payload
}

func assertEquivalentDecoding(payload []byte) error {
	var fromJSON, fromYAML map[string]flagDTO
	if err := json.Unmarshal(payload, &fromJSON); err != nil {
		return fmt.Errorf("decode as JSON: %w", err)
	}
	if err := yaml.Unmarshal(payload, &fromYAML); err != nil {
		return fmt.Errorf("decode as YAML: %w", err)
	}

	jsonNormalized, err := json.Marshal(fromJSON)
	if err != nil {
		return err
	}
	yamlNormalized, err := json.Marshal(fromYAML)
	if err != nil {
		return err
	}
	if !bytes.Equal(jsonNormalized, yamlNormalized) {
		return fmt.Errorf("JSON and YAML decoders produced different values")
	}
	return nil
}
