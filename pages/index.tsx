import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = context.res.req.headers["x-csrf-token"] as string;
  return { props: { csrfToken } };
};

const FormPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken }) => {
  return (
    <div>
      {csrfToken}
      <button
        onClick={async () => {
          const response = await fetch("/api/v3", {
            method: "POST",
            headers: {
              "X-CSRF-Token": csrfToken,
              "Content-Type": "application/json",
            },
          });
          console.log(response);
        }}
      >
        TEST REQUEST
      </button>

      <button
        onClick={async () => {
          const response = await fetch("http://localhost:3000/api/v3/get/byid?id=_2100294b1f", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log(response);
        }}
      >
        TEST CORS
      </button>
    </div>
  );
};

export default FormPage;
