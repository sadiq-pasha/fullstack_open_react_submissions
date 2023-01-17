import React from 'react';
import ReactDOM from 'react-dom/client';
import UnicafeApp from './UnicafeApp';
import AnecdotesApp from './Anecdotes';
import CoursesApp from './Courses';

ReactDOM.createRoot(document.getElementById('courses')).render(<CoursesApp />);
ReactDOM.createRoot(document.getElementById('unicafe')).render(<UnicafeApp />);
ReactDOM.createRoot(document.getElementById('anecdotes')).render(<AnecdotesApp />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
