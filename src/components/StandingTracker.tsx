import { FC, useMemo } from "react";
import { Round } from "../types/types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

type Props = {
  roundsData: {
    data: {
      data: Round[];
    };
    success: boolean;
    message?: string;
  }[];
  teamIds?: number[]; // Array of team IDs
};

const StandingTracker: FC<Props> = ({ roundsData, teamIds }) => {
  // Generate an array of colors for multiple teams
  const teamColors = [
    { border: "#009b72", background: "rgba(0, 155, 114, 0.2)" }, // Default accent
    { border: "#ff3b30", background: "rgba(255, 59, 48, 0.2)" }, // Red
    { border: "#ffcc00", background: "rgba(255, 204, 0, 0.2)" }, // Yellow
    { border: "#007aff", background: "rgba(0, 122, 255, 0.2)" }, // Blue
    { border: "#5ac8fa", background: "rgba(90, 200, 250, 0.2)" }, // Light blue
  ];

  // Use memo to avoid recalculating on every render
  const processedData = useMemo(() => {
    // Ensure we have data before processing
    if (!roundsData?.length) return { rounds: [], teamPositions: [] };

    // Get all the rounds data flattened
    const allRounds = roundsData.map((round) => round.data.data).flat();

    // Get unique round IDs and sort them
    const uniqueRoundIds = [
      ...new Set(allRounds.map((round) => round.round_id)),
    ].sort((a, b) => a - b);

    // Generate round labels (R1, R2, etc.)
    const roundLabels = uniqueRoundIds.map((_id, index) => `R${index + 1}`);

    // If no teamId is provided or empty array, try to find teams with positions
    let teamsToTrack =
      teamIds && teamIds.length > 0
        ? teamIds
        : findTeamsWithPositions(allRounds);

    // Limit to 5 teams maximum for clarity
    if (teamsToTrack.length > 5) {
      teamsToTrack = teamsToTrack.slice(0, 5);
    }

    // Generate position data for each team
    const teamPositions = teamsToTrack.map((id, index) => {
      // Get data for specific team
      const teamData = uniqueRoundIds.map((roundId) => {
        // Find the position for this team in this round
        const roundEntry = allRounds.find(
          (round) => round.round_id === roundId && round.participant_id === id
        );

        return roundEntry?.position || null;
      });

      // Get team name from the data
      const teamName =
        allRounds.find((round) => round.participant_id === id)?.participant
          ?.name || `Team ${id}`;

      return {
        teamId: id,
        teamName,
        positions: teamData,
        color: teamColors[index % teamColors.length],
      };
    });

    return { rounds: roundLabels, teamPositions };
  }, [roundsData, teamIds]);

  // Find teams that have position data in the rounds
  function findTeamsWithPositions(rounds: Round[]): number[] {
    const teamIds = [...new Set(rounds.map((round) => round.participant_id))];

    return teamIds
      .filter((id) => {
        const teamRounds = rounds.filter(
          (round) => round.participant_id === id
        );
        return (
          teamRounds.length > 0 &&
          teamRounds.some((r) => r.position !== undefined)
        );
      })
      .slice(0, 3); // Limit to 3 teams by default when auto-detecting
  }

  // Chart configuration
  const data = {
    labels: processedData.rounds,
    datasets: processedData.teamPositions.map((team) => ({
      label: team.teamName,
      data: team.positions,
      borderColor: team.color.border,
      backgroundColor: team.color.background,
      tension: 0.1,
      pointRadius: 2,
      pointBackgroundColor: team.color.border,
      borderWidth: 2,
    })),
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        reverse: true,
        min: 1,
        max: 20,
        ticks: {
          stepSize: 1,
          callback: function (tickValue: string | number) {
            return Number(tickValue).toFixed(0);
          },
        },
        title: {
          display: true,
          text: "Position",
        },
      },
      x: {
        title: {
          display: true,
          text: "Round",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Team Position by Round",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const datasetLabel = context.dataset.label || "";
            return `${datasetLabel}: Position ${context.parsed.y}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  // If no data available, show a message
  if (processedData.teamPositions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No position tracking data available</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
};

export default StandingTracker;
