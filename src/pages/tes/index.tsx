import HistoricalView from "@components/Fragments/HistoricalView"
import IndexLayout from "@layouts/IndexLayout"
import { PageComponent } from "@nxweb/react"

const Tes: PageComponent = () => {
    return (
        <div>
            <HistoricalView ticketHistory={[]} onDelete={() => {}} />
        </div>
    )
}

Tes.layout = 'default'

export default Tes