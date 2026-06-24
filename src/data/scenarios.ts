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
  {
    id: 'media-streaming',
    title: 'Media Streaming Site',
    description:
      'A site that serves images and video to a huge, read-heavy audience. Static assets dominate traffic, so caching at the edge is essential.',
    requirements: {
      writesPerSecond: 100,
      readsPerSecond: 20000,
      uptimeSlaPercent: 99.95,
      consistency: 'eventual',
      budgetPerMonth: 700,
    },
    passingScore: 70,
  },
  {
    id: 'analytics-ingest',
    title: 'Analytics Ingestion Pipeline',
    description:
      'A firehose of write-heavy event data from clients. Spikes must be absorbed asynchronously so the database is never overwhelmed.',
    requirements: {
      writesPerSecond: 15000,
      readsPerSecond: 500,
      uptimeSlaPercent: 99.9,
      consistency: 'eventual',
      budgetPerMonth: 800,
    },
    passingScore: 70,
  },
]
