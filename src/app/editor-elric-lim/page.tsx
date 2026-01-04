'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PostFile {
  path: string;
  name: string;
  category: string;
}

export default function SecretEditorPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [slug, setSlug] = useState('');
  const [open, setOpen] = useState(true);
  const [sha, setSha] = useState('');
  const [existingPosts, setExistingPosts] = useState<PostFile[]>([]);
  const [selectedPost, setSelectedPost] = useState('');
  const [isNewPost, setIsNewPost] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/editor/posts');
      const data = await response.json();
      setExistingPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setExistingPosts([]);
    }
  };

  const loadPost = async (postPath: string) => {
    try {
      const response = await fetch(`/api/editor/post?path=${encodeURIComponent(postPath)}`);
      const data = await response.json();
      setContent(data.content);
      setTitle(data.title || '');
      setDate(data.date || new Date().toISOString().split('T')[0]);
      setDescription(data.description || '');
      setOpen(data.open !== undefined ? data.open : true);
      setSha(data.sha || '');
      
      const pathParts = postPath.split('/');
      setCategory(data.category || '');
      setSlug(pathParts[pathParts.length - 2]);
    } catch (error) {
      console.error('Failed to load post:', error);
    }
  };

  const handlePostSelection = (value: string) => {
    if (value === 'new') {
      setIsNewPost(true);
      setContent('');
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setCategory('');
      setSlug('');
      setOpen(true);
      setSha('');
    } else {
      setIsNewPost(false);
      setSelectedPost(value);
      loadPost(value);
    }
  };

  const savePost = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/editor/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          title,
          date,
          description,
          category,
          slug,
          open,
          sha,
          isNewPost,
          existingPath: selectedPost
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setSha(result.sha);
        alert('Post saved successfully!');
        fetchPosts();
      } else {
        const error = await response.json();
        alert(`Failed to save post: ${error.details || error.error}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save post');
    }
    setIsSaving(false);
  };



  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">Secret Blog Editor</h1>
          
          <div className="mb-6">
            <Select onValueChange={handlePostSelection}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a post or create new" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Create New Post</SelectItem>
                {existingPosts && existingPosts.map((post) => (
                  <SelectItem key={post.path} value={post.path}>
                    {post.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Post title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Slug (Directory Name)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="url-friendly-name"
                disabled={!isNewPost}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category (Metadata)</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Tech, Life, etc."
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
              placeholder="Brief description of the post"
            />
          </div>
          
          <div className="mb-6">
            <label className="flex items-center space-x-3">
              <span className="text-sm font-medium">Public Visibility</span>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  open ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    open ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600">{open ? 'Published' : 'Draft'}</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Content Editor</h2>
            <div className="space-x-4">
              <Button onClick={savePost} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save & Commit'}
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Markdown Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 px-3 py-2 border rounded-md font-mono text-sm resize-y"
              placeholder="Write your markdown content here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}