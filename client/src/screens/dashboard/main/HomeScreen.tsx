import { Button } from "@/components";
import { Features } from "@/data/feature";
import { BiPlus, BiUser } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";

// components/HeroSection.tsx
const features = [
  {
    title: "Intelligent Auto-completion",
    description: "Smart suggestions based on context and language semantics.",
  },
  {
    title: "Syntax Highlighting",
    description:
      "Beautiful, customizable syntax highlighting for all major languages.",
  },
  {
    title: "Error Detection",
    description: "Real-time error detection and debugging assistance.",
  },
];

const HomeScreen = () => {
  return (
    <>
      <section
        className="relative bg-cover bg-center bg-no-repeat py-16 px-6"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative flex flex-col gap-20 max-w-6xl  mx-auto text-white">
          {/* Main Hero Content */}
          <div className="flex flex-col gap-3 items-center justify-center py-8">
            {/* Left Column - Text Content */}
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="flex flex-col gap-4">
                <h1 className="text-7xl font-bold leading-tight text-center">
                  Code Together,
                  <br />
                  <span className="text-blue-600">Build Faster</span>
                </h1>

                <p className="text-xl max-w-2xl  leading-relaxed text-center">
                  DevSync is the ultimate real-time collaborative code editor.
                  Write, execute, and debug code together with your team in a
                  secure, high-performance environment with multi- language
                  support.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  icon={<BiPlus />}
                  text="Start Coding Now"
                  backgroundColor=" bg-linear-to-r from-blue-500  to-cyan-400"
                  color="text-white"
                />

                <Button
                  icon={<BiUser />}
                  text=" Join Session"
                  backgroundColor="bg-gray-700"
                  color="text-white"
                />
              </div>
            </div>
          </div>

          <div className=" border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {Features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center bg-[#111827] hover:bg-[#111827]/40 border border-gray-200/10 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col gap-6 justify-center items-center"
                >
                  <div
                    className={`w-14 h-14 ${feature.bg} rounded-full p-4 flex items-center justify-center justify-self-center`}
                  >
                    <span className={`${feature.color} text-2xl font-bold`}>
                      {feature.icon}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-xl text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
          {/* Title and Subtitle */}
          <div className="flex flex-col gap-8 bg-[#0F172A] justify-center align-middle items-center py-20">
            <div className=" flex flex-col gap-2 text-center">
              <h2 className="text-4xl font-bold text-white">
                Everything You Need for Collaborative Development
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                DevSync provides a complete development environment with
                advanced features designed for modern teams.
              </p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left side: feature list */}
              <div className="flex flex-col gap-6">
                {features.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <FaCheckCircle className="text-blue-500 text-xl mt-1" />
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right side: code block mockup */}
              <div className="bg-[#1E293B] rounded-xl p-6 font-mono text-sm shadow-lg">
                <div className="flex gap-2 mb-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <pre className="text-gray-300">
                  <code>
                    {`// main.js
function calculateSum(a, b) {
  return a + b;
}

// Real-time collaboration active
console.log("Hello DevSync!");`}
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* CTA Section */}
        
        <div className=" flex flex-col gap-4 justify-center items-center bg-[#090e1afd] py-14 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3">
              Ready to Transform Your Development Workflow?
            </h3>
            <p className="text-gray-400 mb-8">
              Join thousands of developers who are already collaborating more
              effectively with DevSync.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                text="Start Free Session"
                backgroundColor=" bg-linear-to-r from-blue-500  to-cyan-400"
                color="text-white"
              />
              <Button text="Create Account" outline />
            </div>
          </div>
        </div>

    </>
  );
};

export default HomeScreen;
