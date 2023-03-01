const Header = (props) => {
  return (
    <h3>{props.name}</h3>
  )
}

const Part = (props) => {
  return (
    <li>{props.part} {props.exercise}</li>
  )
}

const Content = ({ parts }) => {
  return (
    <ul>
      {parts.map(part =>
        <Part key={part.id} part={part.name} exercise={part.exercises}/>
      )}
    </ul>
  )
}

const Course = ({ courses }) => {
  return (courses.map((course) =>
    <div key={course.id}>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
      <Total totalExercises={course.parts.map((part) => part.exercises)}/>
    </div>
  )
  )
}

const Total = ({ totalExercises }) => {
  return (
    <p><b>total of {totalExercises.reduce((acc, value) => acc + value, 0)} exercises</b></p>
  )
}

export default Course