import {createClass} from 'asteroid'
import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'

const Asteroid = createClass()

class CraterWidget{
  constructor(elem){
    this.elem = elem
    this.posts = []

    this.asteroid = new Asteroid({
      endpoint: "wss://crater.io/websocket"
    })

    this.asteroid.subscribe("postsList", {view: 'top', limit: 5})

    this.asteroid.ddp.on("added", ({collection, id, fields}) => {
      if (collection === 'posts'){
        this.addPost(id, fields)
      }
    })

    this.asteroid.ddp.on("changed", ({collection, id, fields}) => {
      if (collection === 'posts'){
        this.updatePost(id, fields)
      }
    })
  }

  addPost(id, fields) {
    let p = _.merge(fields, {_id: id})
    this.posts.push(p)
    this.render()
  }

  render() {
    ReactDOM.render(<Posts posts={this.posts} />, this.elem)
  }

  updatePost(id, fields) {
    let index = _.findIndex(this.posts, (item)=> {
      return item._id === id
    })

    this.posts[index] = _.merge(this.posts[index], fields)
    this.render()
  }
}



class Posts extends React.Component{
  render() {
    return (
      <div style={_WIDGET_STYLE} key="posts">
        <div style={_HEADER_STYLE}>Crater.io - Top 5</div>
        {this.props.posts.map((post) => {
          return (
            <div style={_ITEM_STYLE} key={post._id}>
              <div style={_LIKE_STYLE}>{post.upvotes}</div>
              <a style={_TITLE_STYLE} href={post.url}>{post.title}</a>
            </div>
          )
        })}
      </div>
    )
  }
}

const _WIDGET_STYLE = {
  border: '1px solid #555',
  display: 'inline-block',
  maxWidth: '400px',
  fontFamily: 'Open Sans',
  borderRadius: '3px'
}

const _HEADER_STYLE = {
  backgroundColor: '#555',
  color: '#fff',
  textAlign: 'center',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  padding: '15px'
}
const _ITEM_STYLE = {
  padding: '5px',
  minHeight: '50px'
}

const _LIKE_STYLE = {
  display: 'block',
  textAlign: 'center',
  float: 'left',
  width: '20px',
  backgroundColor: '#555',
  color: '#fff',
  padding: '15px',
  borderRadius: '3px'
}

const _TITLE_STYLE = {
  display: 'block',
  marginLeft: '60px',
  fontWeight: '300',
  'textDecoration': 'none',
}

var WebFontConfig = {
  google: {families: ['Open+Sans:400,300,600:latin']}
}

var wf = document.createElement('script')
wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
wf.type = 'text/javascript'
wf.async = 'true'
var s = document.getElementsByTagName('script')[0]
s.parentNode.insertBefore(wf, s)

window.CraterWidget = CraterWidget