import { useAppStore } from "@/store/use-app-store";
import MatchCard from "./matches/match-card";
import { Link, useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Separator } from "./ui/separator";
import { ChevronsRight } from "lucide-react";

export default function MatchesByAdmin() {
  const { admins, matches } = useAppStore();
  const navigate = useNavigate();
  const validMatches = (adminId: string) => {
    return matches.filter((item) => item.user_id === adminId);
  };
  return (
    <div className=" grid grid-cols-1 space-y-8">
      {admins &&
        admins.map((item, index) => (
          <div key={item.id}>
            <div className="flex items-center gap-x-2 ">
              <h1 className=" uppercase text-4xl font-bold">{item.username}</h1>
              <div
                className="flex items-center gap-1 underline"
                onClick={() => navigate(`/allmatches/${item.id}`)}
              >
                <ChevronsRight size={30} />
                <span>view</span>
              </div>
            </div>
            <Separator className=" my-2" />
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 2500 * (index + 1),
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              // navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              // onAutoplayTimeLeft={onAutoplayTimeLeft}
              className="bg-background"
            >
              {validMatches(item.id).map((match) => (
                <SwiperSlide key={match.id} className=" py-10 ">
                  <Link to={`${item.id}/matches/${match.id}`}>
                    <MatchCard match={match} />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
    </div>
  );
}
