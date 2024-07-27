import { ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type props = {
  lengthData: number;
  functionNext: () => void;
  children: ReactNode;
};

function InfiniteScrollWrapper({ lengthData, functionNext, children }: props) {
  return (
    <InfiniteScroll
      dataLength={lengthData} 
      next={functionNext}
      hasMore={true}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>You have seen it all</b>
        </p>
      }
    >
      {children}
    </InfiniteScroll>
  );
}

export default InfiniteScrollWrapper;
