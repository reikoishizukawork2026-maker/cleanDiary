import { RouterProvider, createHashRouter } from 'react-router'
import { routes } from './routes.jsx'

// サーバーを持たないので、URL の「#」より後ろで画面を切り替える HashRouter を使う。
// こうすると、どの画面でブラウザを再読み込みしても表示が崩れない
const router = createHashRouter(routes)

function App() {
  return <RouterProvider router={router} />
}

export default App
