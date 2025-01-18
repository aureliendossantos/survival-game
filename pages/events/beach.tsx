import Layout from "components/Layout"
import ProgressButton from "components/ProgressButton/ProgressButton"
import Image from "next/image"
import beach from "public/events/beach.webp"

export default function Event() {
  return (
    <Layout>
      <div className="relative m-auto max-w-[480px] bg-bg-600">
        <div className="relative">
          <Image
            src={beach}
            alt={"Plage"}
            style={{ width: "100%", height: "auto" }}
          />
          <div className="absolute bottom-0 h-[20%] w-[100%] bg-gradient-to-b from-transparent to-bg-600"></div>
        </div>

        <div className="p-[1em] pt-[1px]">
          <p>
            {`Vous vous réveillez sur le sable froid et humide, avec un sacré mal de
          crâne. Vous vous redressez difficilement et scrutez les alentours.`}
          </p>
          <p>
            {`Vous vous trouvez sur le rivage d'une île inconnue, au paysage aussi
          intimidant qu'époustouflant. Une forêt dense s'étend à vos pieds,
          tandis qu'une montagne imposante se dresse au milieu de l'île.`}
          </p>
          <p>
            {`Vous vous sentez seul et perdu, sans savoir comment vous êtes arrivé
          ici. Vous ne vous souvenez de rien. Tout ce que vous savez, c'est que
          vous devez survivre. La forêt pourrait peut-être vous offrir les
          ressources dont vous avez besoin. En premier lieu, vous devriez
          construire un campement avant la tombée de la nuit pour vous abriter
          et vous reposer.`}
          </p>
          <div className="text-right">
            <ProgressButton label="Continuer" task={() => null} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
