import { createContext, useContext, useReducer, useEffect } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(currState, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...currState, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...currState, status: "error" };
    case "start":
      return {
        ...currState,
        status: "active",
        secondsRemaining: currState.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = currState.questions.at(currState.index);
      return {
        ...currState,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? currState.points + question.points
            : currState.points,
      };
    case "nextQuestion":
      return { ...currState, index: currState.index + 1, answer: null };
    case "finish":
      return {
        ...currState,
        status: "finish",
        highscore:
          currState.points > currState.highscore
            ? currState.points
            : currState.highscore,
      };
    case "restart":
      return {
        ...initialState,
        status: "ready",
        questions: currState.questions,
        highscore: currState.highscore,
      };
    case "tickEverySec":
      return {
        ...currState,
        secondsRemaining: currState.secondsRemaining - 1,
        status: currState.secondsRemaining === 0 ? "finish" : currState.status,
        highscore:
          currState.points > currState.highscore
            ? currState.points
            : currState.highscore,
      };

    default:
      throw new Error("Action Unknown");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,

        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside of the QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
