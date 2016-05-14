import axios from 'axios'

const repo = process.env.REPO || 'atom/atom'

const req = axios.create({
  baseURL: 'https://api.github.com/',
  timeout: 10000,
  headers: {
    "Authorization": `token ${process.env.GITHUB_API_TOKEN}`
  }
})

const get = async (url) => {
  if (process.env.REQ_MODE === 'playback') {
    const data = JSON.parse(window.localStorage.getItem(`req-record:${url}`) || "null")
    return data
  }

  const {data} = await req.get(url)
  if (process.env.REQ_MODE === 'record') {
    window.localStorage.setItem(`req-record:${url}`, JSON.stringify(data))
  }

  return data
}

export const getPulls = async (callback) => {
  const pulls = await get(`/repos/${repo}/pulls?per_page=50`)
  callback(pulls)
  pulls.forEach(p => {
    refreshStatus(p, () => callback(pulls))
  })
}

const refreshStatus = async (pull, callback) => {
  const response = await get(`/repos/${repo}/commits/${pull.head.sha}/status`)

  if (response.state === 'failure') {
    pull.status_check = 'fail'
  } else if (response.state === 'pending') {
    pull.status_check = 'pending'
  } else {
    pull.status_check = 'pass'
  }
  callback()
}
