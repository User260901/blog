export type CommentsType = {
  allCount: number,
  comments:
  {
    id: string,
    text: string,
    date: string,
    likesCount: string,
    dislikesCount: string,
    alreadyLiked?: boolean,
    alreadyDisliked?: boolean,
    alreadyReported?: boolean,
    user: {
      id: string,
      name: string,
    }
  }[],

}
