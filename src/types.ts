export type IOAuthAccessTokenResponse = {
  access_token: string
  token_type: string
  scope: string
}

export type IGithubUser = {
  id: number
  login: string
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: any
  blog: string
  location: string
  email: any
  hireable: boolean
  bio: string
  twitter_username: string
  notification_email: any
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export type IQueue = {
  task_type: string
  status: string
  content: string
  code: string
  createdAt: Date
}