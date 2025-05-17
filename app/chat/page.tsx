import ClientSideComponent from "@/components/chat.client"
import Form from "@/components/form"

const ClientPage = () => {
    return(
        <>
        <div className="flex flex-col items-center justify-center mt-22 gap-y-2">
        <Form  />
        </div>
        <div className="flex flex-col items-center justify-center mt-22 gap-y-2 bg-white/50 p-4 rounded">
          <ClientSideComponent   />
        </div>
        </>
    )

}


export default ClientPage