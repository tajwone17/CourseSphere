import React from "react";
import { MdInfoOutline } from "react-icons/md"; // Icon import

export default function About() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-4xl rounded-lg border-2 border-white p-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          <MdInfoOutline size={30} color="#92e3a9" />
          <h1 className="text-3xl font-extrabold">About Us</h1>
        </div>
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-justify text-lg font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
            nostrum non delectus, ad quasi exercitationem assumenda nam
            excepturi alias molestiae fugit sunt illo ullam odit quisquam
            blanditiis temporibus, laudantium tempora minus, tenetur mollitia
            libero ea. Ipsam, consequatur. Voluptatibus, at tempore distinctio
            amet consequuntur repudiandae natus id sunt quas, unde magni? Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Cum, repellendus?
            Quasi exercitationem, saepe reiciendis placeat assumenda et ullam
            voluptas aperiam. Quo aperiam eum facilis consequuntur laboriosam
            assumenda distinctio perferendis nostrum! Mollitia at tempora,
            perferendis fugit corporis tempore repellat sapiente eligendi. Sunt
            corrupti dolor magnam inventore, deleniti porro distinctio
            temporibus eaque? Id placeat sint aspernatur aut, recusandae
            excepturi! Provident, facere quam. Voluptas error dolor quis
            corporis quae consequatur neque minus ipsum. Dolorem mollitia
            recusandae cumque unde explicabo. Distinctio repellat non deleniti!
            Saepe voluptatum recusandae dolores iure nostrum aliquid, amet esse
            expedita. Velit eligendi illum pariatur minus aliquam deleniti
            perspiciatis excepturi nulla?
          </p>
        </div>
      </div>
    </div>
  );
}
