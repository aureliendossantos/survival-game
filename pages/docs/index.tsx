import { GetStaticProps, InferGetStaticPropsType } from "next"
import { createSwaggerSpec } from "next-swagger-doc"
import dynamic from "next/dynamic"
import "swagger-ui-react/swagger-ui.css"

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    apiFolder: "pages/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Survival Game API",
        version: "alpha",
      },
    },
  })
  return {
    props: {
      spec,
    },
  }
}

const SwaggerUI = dynamic<{
  spec: any
}>(import("swagger-ui-react"), { ssr: false })

export default function ApiDoc({
  spec,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />
}
