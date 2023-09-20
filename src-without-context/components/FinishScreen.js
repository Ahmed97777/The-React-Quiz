function FinishScreen({ points, totalPoints, highscore, dispatch }) {
  const pointsPercentage = (points / totalPoints) * 100;

  let emoji;
  if (pointsPercentage === 100) emoji = "🥇";
  if (pointsPercentage >= 80 && pointsPercentage < 100) emoji = "🎉";
  if (pointsPercentage >= 50 && pointsPercentage < 80) emoji = "🙃";
  if (pointsPercentage >= 0 && pointsPercentage < 50) emoji = "🤔";
  if (pointsPercentage === 0) emoji = "🤦‍♂️🤦‍♀️";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {totalPoints} ({Math.ceil(pointsPercentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
