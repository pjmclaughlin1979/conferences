interface ChartData {
  timeOfDay: "Morning" | "Afternoon" | "Evening" | "Night" | string,
  season: "Winter" | "Spring" | "Summer" | "Fall" | string,
  value: number
}