const Notification = ({message}) => {
    if(message === null){
      return null
    }
    
  return (
    <div className=" bg-slate-300 text-lg border border-solid rounded-md p-2 mb-3 text-red-500">
        {message}
    </div>
  )
}

export default Notification