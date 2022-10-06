// import { CreateUserRes, ResponseType } from "@/models"
// import Cookies from "cookies"
// import httpProxy, { ProxyResCallback } from "http-proxy"
// import type { NextApiRequest, NextApiResponse } from "next"

// export const config = {
//   api: {
//     bodyParser: false,
//     externalResolver: true,
//   },
// }

// const proxy = httpProxy.createProxyServer()

// export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseType<any>>) {
//   if (req.method !== "POST") {
//     return res.status(404).json({
//       message: "method not supported",
//       success: false,
//       data: [],
//       status_code: 404,
//     })
//   }

//   console.log("refresh token")

//   return new Promise((resolve) => {
//     const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== "development" })

//     const refresh_token = cookies.get("refresh_token")
//     if (!refresh_token)
//       return res.json({
//         data: null,
//         status_code: 401,
//         message: "Missing refresh token",
//         success: false,
//       })
//     console.log({ refresh_token })
//     req.headers.Authorization = `Bearer ${refresh_token}`

//     proxy.on("proxyReq", function (proxyReq, req, res, options) {
//       // proxyReq.write({ refresh_token })
//     })

//     const handleRefreshTokenRes: ProxyResCallback = (proxyRes, req, res) => {
//       let body = ""
//       proxyRes.on("data", function (chunk) {
//         body += chunk
//       })
//       proxyRes.on("end", function () {
//         try {
//           const response = JSON.parse(body) as ResponseType<CreateUserRes>
//           if (!response?.success)
//             return (res as NextApiResponse<ResponseType<CreateUserRes>>).status(200).json(response)

//           const { access_token, refresh_token } = response.data

//           // Save access token to cookie
//           cookies.set("access_token", access_token, {
//             httpOnly: true,
//             sameSite: "lax",
//             expires: new Date(new Date().setDate(new Date().getDate() + 3)),
//           })

//           // Save refresh token to cookie
//           cookies.set("refresh_token", refresh_token, {
//             httpOnly: true,
//             sameSite: "lax",
//             expires: new Date(new Date().setDate(new Date().getDate() + 3)),
//           })
//           ;(res as NextApiResponse<ResponseType<CreateUserRes>>).status(200).json(response)
//         } catch (error) {
//           ;(res as NextApiResponse).status(500).json(error)
//         }

//         resolve(true)
//       })
//     }

//     proxy.once("proxyRes", handleRefreshTokenRes)
//     proxy.web(req, res, {
//       target: process.env.NEXT_PUBLIC_API_URL,
//       changeOrigin: true,
//       selfHandleResponse: true,
//     })
//   })
// }
