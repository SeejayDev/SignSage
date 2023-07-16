import Header from '@components/Header'
import React from 'react'

const progress = () => {

  // how to track student progress?

  // Plan A: store list of lesson IDs that have been completed.
  // When student matches the pose, mark as completed.
  let data = ["id1", "id2", "id3"]
  
  // OBJECTIVE: to display progress of courses selected:
  // APPROACH: Display progress of saved courses on the dashboard, and mark completed lessons on the course page.

  // Part 1/2: Display progress of course on student dashboard
  // step 1: fetch list of saved courses (already being done)
  // step 2: fetch list of completed lessons
  // At this point, both the courses and completed lessons list only stores IDs, not the actual lesson content. Thats fine.
  // Use a function to determine how many percent of the lesson course IDs are in the completed lessons list.
  // step 3: display the progress below each course in the swiper.

  // Part 2/2: Display completion marks on the lessons when displaying a course
  // step 1: fetch the lessons contained within the course (already being done)
  // step 2: fetch the list of completed lessons
  // step 3: While rendering the list of lessons, place a mark on the lesson if it is present in the list.

  // HOW WILL THE PROGRESS DATA BE STORED?
  // Option 1: Store as part of user profile.
  // Pros: easy to access, no need for new code
  // Cons: User profile becomes heavy even when not needed
  
  // Option 2: Store under a new collection called lesson tracking
  
  // Decision: Store as part of user profile because:
  // - it works
  // - lecturer is not going to care anyway

  return (
    <>
      <Header />
    </>
  )
}

export default progress