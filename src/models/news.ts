import { ListQuery } from "./common"

export interface PostRes {
  postId: string
  title: string
  subTitle: string
  content: string
  shortContent: string
  author: {
    authorId: string
    authorName: string
  }
  tags: string[]
  thumbnail: string
  slug: string
  category: {
    categoryId: string
    categoryName: string
  }
  createdAt: string
}

export interface RelatedPost {
  postId: string
  slug: string
  thumbnail: string
  subTitle: string
  shortContent: string
  createdAt: string
}

export interface PostDetailRes {
  postId: string
  title: string
  subTitle: string
  content: string
  shortContent: string
  author: {
    authorId: string
    authorName: string
  }
  tags: string[]
  thumbnail: string
  slug: string
  category: {
    categoryId: string
    categoryName: string
  }
  createdAt: string
  relatedPosts?: RelatedPost[]
}

export interface CategoryRes {
  categoryId: string
  name: string
  slug: string
  parentId: string
  image: string
  desc: string
  postCount: number
  createdAt: string
}

export interface GetPostsParams extends ListQuery {
  categoryId?: string
}
