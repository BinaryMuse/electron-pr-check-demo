/** @jsx etch.dom */

import etch from 'etch'
import stateless from 'etch-stateless'

const repo = process.env.REPO || 'atom/atom'

const renderPull = (pull) => <Pull key={pull.number} pull={pull} />

const instances = new Set()

class RotatingProgress {
  constructor(props) {
    this.props = props
    etch.initialize(this)
    instances.add(this)
  }

  update(props) {
    this.props = props
    etch.update(this)
  }

  render() {
    return <span className={`icon icon-progress-${RotatingProgress.icon}`} {...this.props} />
  }

  destroy () {
    instances.remove(this)
    etch.destroy(this)
  }
}

RotatingProgress.icon = 0
RotatingProgress.tick = () => {
  RotatingProgress.icon += 1
  if (RotatingProgress.icon > 3) {
    RotatingProgress.icon = 0
  }

  instances.forEach(inst => etch.update(inst))
}
RotatingProgress.interval = setInterval(RotatingProgress.tick, 1000)

export const Application = stateless(etch, ({pulls}) => {
  return (
    <div id="app-container">
      <header className="toolbar toolbar-header">
        <h1 className="title">{repo} PR Status</h1>
      </header>

      <section id="app-content">
        <table className="table-striped">
          <thead>
            <tr>
              <th>Number</th>
              <th>Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pulls.map(renderPull)}
          </tbody>
        </table>
      </section>
    </div>
  )
})

const Pull = stateless(etch, ({pull}) => {
  return (
    <tr>
      <td>
        <span>{pull.number}</span>
      </td>
      <td style="max-width: 250px; overflow: hidden;">
        <span>{pull.title}</span>
      </td>
      <td style="text-align: center;">
        <Status type={pull.status_check} />
      </td>
    </tr>
  )
})

const Status = stateless(etch, ({type}) => {
  console.log('type', type)
  switch (type) {
  case "pass":
    return <span className="icon icon-check" style="color: green" />
  case "fail":
    return <span className="icon icon-cancel" style="color: red" />
  case "pending":
    return <RotatingProgress style="color: #FF8600" />
  default:
    return <span className="icon icon-dot-3" style="color: gray" />
  }
})
