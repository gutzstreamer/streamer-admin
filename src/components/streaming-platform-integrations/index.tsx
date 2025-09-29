export const PlatformType = {
  TWITCH: "TWITCH",
  YOUTUBE: "YOUTUBE", 
  TIKTOK: "TIKTOK",
};

export const platformTypeChoices = Object.entries(PlatformType).map(
  ([key, value]) => ({
    id: value,
    name: key.charAt(0) + key.slice(1).toLowerCase(),
  }),
);

export const statusChoices = [
  { id: true, name: "Active" },
  { id: false, name: "Inactive" },
];