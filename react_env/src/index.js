import React from 'react';
import ReactDOM from 'react-dom/client';
import UnicafeApp from './1.6-1.11_UnicafeApp';
import AnecdotesApp from './1.12-1.14_Anecdotes';
import CoursesApp from './1.1-1.5_Courses';
import CourseInformation from './2.1-2.5_CourseInformation';

ReactDOM.createRoot(document.getElementById('courses')).render(<CoursesApp />);
ReactDOM.createRoot(document.getElementById('unicafe')).render(<UnicafeApp />);
ReactDOM.createRoot(document.getElementById('anecdotes')).render(<AnecdotesApp />);
ReactDOM.createRoot(document.getElementById('courseInformation')).render(<CourseInformation/>)