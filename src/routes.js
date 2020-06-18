import Home from './views/Home.vue'
import Chat from './views/Chat.vue'
import NotFound from './views/NotFound.vue'

export let routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  { path: '/chat/:room', component: Chat, meta: { title: 'Video Chat' } },
  { path: '/:path(.*)', component: NotFound },
]
