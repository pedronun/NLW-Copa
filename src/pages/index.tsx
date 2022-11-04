import Image from "next/image";

import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImage from "../assets/users-avatar-example.png";
import iconCheck from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/pools", { title: poolTitle });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso, o código foi copiado para a área de transferência!"
      );
      setPoolTitle("");
    } catch (err) {
      alert("Erro ao criar o bolão, tente novamente!");
    }
  };

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28 md:grid-cols-1 md:px-5">
      <main>
        <Image src={logoImg} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight md:text-4xl">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImage} alt="App NLW Copa" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> pessoas já
            estão usando
          </strong>
        </div>
        <form onSubmit={handleSubmit} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100 md:px-3"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            onChange={(e) => setPoolTitle(e.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-yellow-700 md:text-xs"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="text-gray-300 mt-4 text-sm leading-relaxed md:text-xs">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6 md:gap-2">
            <Image src={iconCheck} alt="Ícone de check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"></div>
          <div className="flex items-center gap-6 md:gap-2">
            <Image src={iconCheck} alt="Ícone de check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
        className="md:hidden"
      />
    </div>
  );
}

export async function getStaticProps() {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
}
