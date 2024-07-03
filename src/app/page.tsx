"use client"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import qrcode from "qrcode"
import Image from "next/image"

const formSchema = z.object({
  url: z.string().url()
})

const size: number = 500

export default function Home() {
  const imageRef = useRef(null)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.url) {
      const { url } = values
      const qrCodeDataUrl = await qrcode.toDataURL(url, {
        width: size
      })
      setQrCodeData(qrCodeDataUrl)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <Form {...form}>
        <form className={cn("w-1/2 flex gap-3")} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="url"
            control={form.control}
            render={({ field }) => (
              <FormItem className={cn("flex-1 border")}>
                <input {...field} placeholder="Enter url" type="url" className={cn("h-full w-full")} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className={cn("bg-green-600")}>
            {" "}
            Generate QR code
          </Button>
        </form>
      </Form>
      {qrCodeData && (
        <>
          <Image ref={imageRef} src={qrCodeData} alt="QR CODE generated" width={size} height={size} />
          <div>
            <Button className={cn("bg-sky-500 mx-4 px-4 py-2 rounded text-white cursor-pointer")}>
              <a download href={qrCodeData}>
                Download QR Code
              </a>
            </Button>
          </div>
        </>
      )}
    </main>
  )
}
