import Layout from "./components/layout";

import { Separator } from "./components/ui/separator";
import MatchesByAdmin from "./components/MatchesByAdmin";

function App() {
  return (
    <Layout>
      <div
        className="w-full h-[20rem] sm:h-[30rem]  flex flex-col items-center justify-center relative"
        // style={{
        //   backgroundImage: `url(${backgroundImage})`,
        //   backgroundPosition: "center",
        //   backgroundRepeat: "no-repeat",
        //   backgroundSize: "cover",
        // }}
      >
        <p className="text-7xl font-bold text-pretty text-primary text-">
          FOOTBALL
        </p>
      </div>
      <div className="container">
        <div className=" mb-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-primary">
            Today Matches
          </h1>
        </div>
        <Separator className="mb-10" />
        <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-2">
          {/* {matches &&
            matches.map((item) => {
              if (!item || !item.id) {
                console.log("invalid match");
                return null;
              }
              return (
                <Link to={`${item.admin_id}/matches/${item.id}`} key={item.id}>
                  <MatchCard match={item} />
                </Link>
              );
            })} */}
        </div>
        <MatchesByAdmin />
      </div>
    </Layout>
  );
}

export default App;
