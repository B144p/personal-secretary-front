import React from "react";

export default function Page() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="bg-muted/50 aspect-video h-24 w-full rounded-lg max-w-3xl mx-auto" />
          <div className="bg-muted aspect-video h-96 w-full rounded-lg max-w-3xl mx-auto" />
        </React.Fragment>
      ))}
    </>
  );
}
