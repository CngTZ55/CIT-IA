import { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image"; // Importar Teachable Machine

import camera from "./assets/camera.png";
import dog from "./assets/dog.png";
import cat from "./assets/cat.png";

export const DetectionBox = () => {
  const [detection, setDetection] = useState([]);
  const [onDetection, setOnDetection] = useState(false);
  const [confirmar, setConfirmar] = useState(null);
  const [model, setModel] = useState(null);
  const [webcam, setWebcam] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0); // Inicializar con 0
  const canvasRef = useRef(null); // Usar useRef para el canvas

  useEffect(() => {
    const init = async () => {
      const URL = "/model/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      // Cargar el modelo y los metadatos
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      setMaxPredictions(loadedModel.getTotalClasses());
    };
    init();
  }, []);

  useEffect(() => {
    if (onDetection && model) {
      loadWebcam();
    } else if (!onDetection && webcam) {
      webcam.stop();
      setWebcam(null);
      setDetection([]);
      // Limpiar el canvas cuando la webcam se detiene
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height); // Limpiar todo el canvas
      }
    }
  }, [onDetection, model]);

  function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Detecta dispositivos móviles (iOS, Android, Windows Phone)
    return /android|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(userAgent);
  }
  

  async function loadWebcam() {
    const flip = false; // Cambiado a 'false', ya que queremos que la cámara trasera no se voltee.
    const isMobileDevice = isMobile();
  
    // Configurar restricciones sin `exact` para mejorar compatibilidad
    const constraints = {
      video: {
        facingMode: isMobileDevice ? "environment" : "user",
      }
    };
  
    const webcamInstance = new tmImage.Webcam(300, 300, flip); // Ancho, alto, flip (false)
    setWebcam(webcamInstance);
  
    // Configurar la webcam con las restricciones
    await webcamInstance.setup(constraints.video); // Pedir acceso a la cámara
    await webcamInstance.play(); // Iniciar la cámara
  
    // Iniciar el loop de actualización de frames
    window.requestAnimationFrame(() => loop(webcamInstance));
  }
  

  async function loop(webcamInstance) {
    if (webcamInstance) {
      // console.log('Actualizando webcam:', webcamInstance);
      try {
        // Verificar si update es una función antes de llamarla
        if (typeof webcamInstance.update === "function") {
          webcamInstance.update(); // Actualizar el frame de la webcam
          drawCanvas(webcamInstance); // Dibuja la imagen de la webcam en el canvas
          window.requestAnimationFrame(() => loop(webcamInstance)); // Volver a llamar a loop
        } else {
          console.error("webcamInstance.update no es una función válida.");
        }
      } catch (error) {
        console.error("Error en loop:", error);
      }
    }
  }

  function drawCanvas(webcamInstance) {
    const canvas = canvasRef.current;
    if (canvas && webcamInstance) {
      const context = canvas.getContext("2d");
      context.drawImage(webcamInstance.canvas, 0, 0); // Dibuja la imagen de la webcam en el canvas
    }
  }

  async function predict() {
    // Realiza la predicción aquí y actualiza el estado de detección
    if (model && webcam) {
      const predictions = await model.predict(webcam.canvas);
      const results = predictions.slice(0, maxPredictions); // Asegúrate de no exceder el número de clases

      // Aquí puedes manejar la lógica para mostrar las mejores predicciones
      setDetection(results);
    }
  }

  const handleWebCam = async () => {
    if (confirmar === null) {
      setConfirmar(true);
    } else if (confirmar) {
      setOnDetection((prev) => !prev);
      setConfirmar(null);
    }
  };

  const handleDetection = async () => {
    if (onDetection && model) {
      await predict(); // Realizar la predicción
    }
  };

  const isDogOrCat =
    detection[0]?.probability.toFixed(2) > 0.5
      ? detection[0]?.className
      : detection[1]?.className;
  const isDogOrCatProbability =
    isDogOrCat === "gato"
      ? detection[0]?.probability.toFixed(2)
      : detection[1]?.probability.toFixed(2);

  console.log("isDogOrCat:", isNaN((isDogOrCatProbability * 100).toFixed(2)));

  const isDogOrCatPercent = isNaN((isDogOrCatProbability * 100).toFixed(2))
    ? 0
    : (isDogOrCatProbability * 100).toFixed(2);

  return (
    <div className="flex mobile:flex-col md:flex-row lg:flex-row bg-[#E5E6D8] mt-5 items-center justify-center h-screen w-screen">	 
      <div className="flex flex-col items-center justify-center mx-5">
        <h2 className="font-bold text-2xl border-b-2 border-gray-800 mb-2">
          Detectron MK-2
        </h2>
        {confirmar && (
          <div className="bg-white font-extrabold text-center text-green-600 p-5 rounded-md shadow-md mb-5">
            {!onDetection
              ? "¡Presiona de nuevo, para despertar la maquina!"
              : "¡Presiona de nuevo, para apagar la maquina!"}
          </div>
        )}
        <div className="flex items-center justify-center mb-4">
          {onDetection ? (
            <canvas
              className="rounded-md"
              ref={canvasRef}
              width={300} // Asegúrate de que el ancho coincida con el de la webcam
              height={300} // Asegúrate de que la altura coincida con el de la webcam
            />
          ) : (
            <div className="flex items-center justify-center bg-gray-200 p-5 rounded-md shadow-md">
              <img src={camera} alt="camera" className="" />
            </div>
          )}
        </div>
        <button
          onClick={handleWebCam}
          className={`p-2 ${ !onDetection ? 'bg-[#1FC473] hover:border-[#89dcb4]' : 'bg-none border-2 border-red-600 text-red-600 hover:border-[#dc8989]'} hover:border-4 rounded-md text-white font-semibold`} 
        >
          {onDetection ? "Finalizar IA" : "Iniciar IA"}
        </button>
      </div>

      <div className="mobile:mt-5 sm:mx-5 md:mx-5 lg:mx-5 flex flex-col items-center justify-center"> 
        <h3 className="text-2xl mb-10 border-b-2 border-[#1FC473]">
          Detectecciones
        </h3>
        {onDetection && (
          <>
            <p>
              Es un: {isDogOrCat} - {isDogOrCatPercent}%
            </p>
            <div className="mobile:mt-5 lg:mt-16">
              {isDogOrCat === "perro" && (
                <img src={dog} alt="dog" className="w-32 h-32" />
              )}
              {isDogOrCat === "gato" && (
                <img src={cat} alt="cat" className="w-32 h-32" />
              )}
            </div>
            <button
              className="lg:mt-12 p-2 bg-[#1fc4b4] hover:border-4 hover:border-[#89dcb4] rounded-md text-white font-semibold"
              onClick={handleDetection}
            >
              Detectar
            </button>
          </>
        )}
      </div>
    </div>
  );
};
