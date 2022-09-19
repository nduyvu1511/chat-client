import { ResponseType } from "@/models"
import Cookies from "cookies"
import httpProxy from "http-proxy"
import type { NextApiRequest, NextApiResponse } from "next"

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

const proxy = httpProxy.createProxyServer()

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseType<any>>) {
  return new Promise((resolve) => {
    const cookies = new Cookies(req, res)
    // const token = cookies.get("access_token")

    // if (token) {
    //   req.headers.Authorization = `Bearer ${token}`
    // }
    // don't send cookies to API server
    proxy.once("proxyRes", () => {
      resolve(true)
    })
    proxy.web(req, res, {
      target: process.env.NEXT_PUBLIC_API_URL,
      changeOrigin: true,
      selfHandleResponse: false,
    })
  })
}
