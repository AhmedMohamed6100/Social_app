import CreatePost from '../../Components/CreatePost/CreatePost'
import MyPostsForMe from '../../Components/MyPostsForMe/MyPostsForMe'
import PostSidebar from '../../Components/PostSidebar/PostSidebar'
import SuggestedFriends from '../../Components/SuggestedFriends/SuggestedFriends'

export default function Feed() {
  return (
  
  <div className="flex gap-5 justify-center max-w-7xl mx-auto pt-6 px-4 items-start">
    
    <div className="w-1/4 hidden lg:block sticky top-20 h-fit">
      <PostSidebar />
    </div>
  
    <div className="flex-1 max-w-2xl w-full flex flex-col gap-5">
    <CreatePost />  
      <MyPostsForMe />
    </div>
  
    <div className="w-1/4 hidden xl:block sticky top-20 h-fit">
      <SuggestedFriends />
    </div>
    
  </div>

  )
}
