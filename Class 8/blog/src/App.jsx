import { useState } from "react";
import Blog from "./components/Blog";

export default function App() {
  const [blogs, setBlog] = useState([
    {
      id: 1,
      title: "Blog 1",
      content: "This is the content of blog 1",
      author: "Author 1",
      date: "2023-01-01",
    },
    {
      id: 2,
      title: "Blog 2",
      content: "This is the content of blog 2",
      author: "Author 2",
      date: "2023-01-02",
    },
    {
      id: 3,
      title: "Blog 3",
      content: "This is the content of blog 3",
      author: "Author 3",
      date: "2023-01-03",
    },
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const deleteBlog = (id) => {
    setBlog(blogs.filter((item) => item.id !== id));
  };

  const addBlog = (e) => {  
    e.preventDefault();
    setBlog([
      ...blogs,
      {
        id: blogs.length + 1,
        title,
        content,
        author,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setTitle("");
    setContent("");
    setAuthor("");
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Blog</h1>
      {/* blog list header: search, add new blog */}
      {/* todo:: search blog */}
      <input
        type="text"
        placeholder="Search blogs..."
        className="border border-gray-300 rounded-md px-4 py-2 mr-2 my-4"
      />
      {/* extract this part into a separate component */}
      <div className="border border-gray-300 rounded-md p-4 my-4">
        <form className="flex items-center flex-col space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Blog title"
            className="border border-gray-300 rounded-md px-4 py-2 mr-2"
          />

          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            type="text"
            placeholder="Author"
            className="border border-gray-300 rounded-md px-4 py-2 mr-2"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Blog content"
            className="border border-gray-300 rounded-md px-4 py-2 mr-2"
          />

          {/* todo:: conditionally active/inactive add button */}
          <button onClick={(e) => addBlog(e)} className="bg-[#007bff] text-white px-4 py-2 rounded-md cursor-pointer">
            Add New Blog
          </button>
        </form>
      </div>

      {/* blog list */}
      <div className="mt-5">
        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs available</p>
        ) : (
          blogs.map((item) => (
            <Blog
              key={item.id}
              blog={item}
              deleteBlog={deleteBlog}
            />
          ))
        )}
      </div>
    </div>
  );
}
