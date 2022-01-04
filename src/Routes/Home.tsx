import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchMovieNow } from "../api";
import { makeImgPath } from "../utils";

interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  height: 200px;
`;

const rowVariants = {
  hidden: { x: window.outerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 5 },
};

const Box = styled(motion.div)`
  font-size: 10px;
  text-align: center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  img {
    width: 100%;
    object-fit: cover;
  }
`;

const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -80,
    transition: { delay: 0.5, duration: 0.2, type: "tween" },
  },
};

const Info = styled(motion.div)`
  width: 100%;
  height: 50px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.2, type: "tween" },
  },
};

let offset = 6;

function Home() {
  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    fetchMovieNow
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const indexUp = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const maxIndex = Math.floor((data?.results.length - 1) / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImgPath(data?.results[0].backdrop_path || "")}
            onClick={indexUp}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence
              onExitComplete={() => setLeaving(false)}
              initial={false}
            >
              <Row
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 1, type: "tween" }}
              >
                {data?.results
                  .slice(1)
                  .slice(index * offset, offset * (index + 1))
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                    >
                      <img
                        src={makeImgPath(movie.backdrop_path, "w500")}
                        alt=""
                      />
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
