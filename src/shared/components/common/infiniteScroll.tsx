// import { ReactNode, useEffect } from "react"
// import { useInView } from "react-intersection-observer"
// import { Spinner } from "./spinner"

// interface InfiniteScroll {
//   isLoading?: boolean
//   onScrollToTop?: Function
//   onScrollToBottom?: Function
//   hasBottom: boolean
//   hasTop: boolean
//   children: ReactNode
// }

// export const InfiniteScroll = (props: InfiniteScroll) => {
//   const { children, hasBottom, isLoading, onScrollToBottom, onScrollToTop, hasTop } = props
//   const { ref: bottomRef, inView: inBottomView } = useInView()
//   const { ref: topRef, inView: inTopView } = useInView()

//   useEffect(() => {
//     if (isLoading || !hasBottom) return

//     // onScrollToBottom?.()

//     console.log("scrolled to bottom")
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [inBottomView])

//   useEffect(() => {
//     if (isLoading || !hasTop) return

//     onScrollToTop?.()

//     console.log("scrolled to top")
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [inTopView])

//   return (
//     <div className="">
//       <div ref={topRef} className=""></div>
//       {children}
//       {isLoading ? <Spinner className="py-24" size={24} /> : null}
//       <div ref={bottomRef} className=""></div>
//     </div>
//   )
// }
