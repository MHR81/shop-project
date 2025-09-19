import PageTransition from "../components/common/PageTransition";
import HomeCard1 from '../components/Main/HomeCard-1.jsx'
import HomeCategories2 from '../components/Main/HomeCategories-2.jsx'
import HomeCarousel3 from '../components/Main/HomeCarousel-3.jsx'

export default function Main() {
    return (
        <PageTransition>
            <br />
            <HomeCard1 />
            <br />
            <HomeCategories2 />
            <br />
            <HomeCarousel3 />
        </PageTransition>
    )
}