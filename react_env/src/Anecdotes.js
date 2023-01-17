import { useState } from 'react'

const Button = (props) => {
    return (
        <button onClick={() => props.onClick(props.buttonFunction)}>{props.text}</button>
    )
}

const AnecdotesApp = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]
   
    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
    const [maxVotesIndex, setmaxVotesIndex] = useState(0)
  
    const handleClick = (buttonFunction) => {
        let newAnecdotesIndex = selected
        let resetVotes = [...votes]
    
        if (buttonFunction === "random") {
            while (newAnecdotesIndex === selected) {
                newAnecdotesIndex = Math.floor(Math.random() * (anecdotes.length))
            }
        } else if (buttonFunction === "sequence") {
            newAnecdotesIndex = (newAnecdotesIndex + 1) % anecdotes.length;
        } else if (buttonFunction === "reset") {
            resetVotes = new Array(anecdotes.length).fill(0);
        }
        setSelected(newAnecdotesIndex);
        setVotes(resetVotes);
    }

    const handleVote = () => {
        // increment the vote count for the voted anecdote
        let votesCopy = [...votes]
        votesCopy[selected] += 1
        // handle the most popular anecdote
        const maxVotes = votesCopy.reduce((max, value) => Math.max(max,value))
        const maxVotesIndices = [...votesCopy.keys()].filter((i) => votesCopy[i] === maxVotes)
        const newMaxVotesIndex = maxVotesIndices[Math.floor(Math.random() * (maxVotesIndices.length))]
        // console.log(maxVotesIndices)
        // console.log(newMaxVotesIndex)
        setmaxVotesIndex(newMaxVotesIndex)
        setVotes(votesCopy)
    }

    const DisplayPopular = () => {
        if (votes[maxVotesIndex] === 0) {
            return (
                <>
                    No votes yet
                </>
            )
        } else {
            return (
            <>
                {anecdotes[maxVotesIndex]}<br/>
                votes: {votes[maxVotesIndex]}
            </>
            )
        }
    }

  return (
    <div>
        <h2>ANECDOTES</h2>
        <h3>Anecdote of the day</h3>
        {anecdotes[selected]}<br/>
        votes: {votes[selected]}<br/>
        <Button onClick={handleVote} text="vote"/><br/>
        <Button onClick={handleClick} buttonFunction="random" text="random anecdote"/>
        <Button onClick={handleClick} buttonFunction="sequence" text="next anecdote"/>
        <Button onClick={handleClick} buttonFunction="reset" text="reset votes"/>
        <h3>Anecdote with most votes</h3>
        <DisplayPopular/>
    </div>
  )
}

export default AnecdotesApp