import type { Scenario } from '../types'

export const SCENARIOS: Scenario[] = [
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    description:
      'A service that shortens long URLs and redirects visitors to the original link. Redirects vastly outnumber new links being created.',
    requirements: {
      writesPerSecond: 50,
      readsPerSecond: 5000,
      uptimeSlaPercent: 99.9,
      consistency: 'eventual',
      budgetPerMonth: 400,
    },
    passingScore: 70,
  },
  {
    id: 'realtime-chat',
    title: 'Realtime Chat App',
    description:
      'A chat application where messages are sent and read at roughly the same rate. High availability matters more than raw read scaling.',
    requirements: {
      writesPerSecond: 2000,
      readsPerSecond: 2000,
      uptimeSlaPercent: 99.95,
      consistency: 'eventual',
      budgetPerMonth: 600,
    },
    passingScore: 70,
  },
]
