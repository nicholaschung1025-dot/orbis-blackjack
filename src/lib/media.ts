const BASE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P";

export const VIDEOS = {
  hero: `${BASE}/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4`,
  about: `${BASE}/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4`,
  cta: `${BASE}/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4`,
  objectOne: `${BASE}/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4`,
  objectTwo: `${BASE}/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4`,
  objectThree: `${BASE}/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4`,
} as const;

export const RATIOS = {
  hero: "1860 / 1112",
  about: "1844 / 1124",
  cta: "1784 / 1160",
  object: "1320 / 1568",
} as const;
