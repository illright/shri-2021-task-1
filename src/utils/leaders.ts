import type { LeadersData, TeamMember } from '../data';

const maxPlaces = 5;
const maxPlacesPortrait = 3;
const selectedEmoji = '👍';

interface StandingsMember {
  member: TeamMember;
  place: number;
  emoji: string | null;
}

interface Bar {
  main: StandingsMember;
  extra?: StandingsMember;
}

function getEmojiForMember(member: TeamMember, index: number, data: LeadersData) {
  if (index === 0) {
    return data.emoji;
  } else if (member.id === data.selectedUserId) {
    return selectedEmoji;
  } else {
    return null;
  }
}

export function generateBars(data: LeadersData): Bar[] {
  const bars: Bar[] = data.users.slice(0, maxPlaces).map(
    (member, idx) => ({
      main: {
        member,
        place: idx + 1,
        emoji: getEmojiForMember(member, idx, data),
      },
    })
  );
  const selectedUserPlace = data.users.findIndex(member => member.id === data.selectedUserId) + 1;

  if (selectedUserPlace > maxPlacesPortrait) {
    bars[0].extra = {
      member: data.users[selectedUserPlace - 1],
      place: selectedUserPlace,
      emoji: selectedEmoji,
    };
  }

  if (selectedUserPlace > maxPlaces) {
    bars[bars.length - 1].main = {
      member: data.users[selectedUserPlace - 1],
      place: selectedUserPlace,
      emoji: selectedEmoji,
    };
  }

  return bars;
}
