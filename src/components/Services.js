import axios from "axios";
import { toast } from "react-toastify";
import Card from "./Card";
import { API_URL } from "../config";

const allProducts = [
  {
    title: "PIGMENT FINE PASTE",
    img: "card1.png",
    text: "Premium pigment fine paste ideal for achieving bright, enduring colors in various industrial applications.",
  },
  {
    title: "COIR COATING",
    img: "card2.png",
    text: "Highly durable coir coating ensuring excellent protection and long-lasting finish for specialized surfaces.",
  },
  {
    title: "ARTIST PAINT",
    img: "card3.png",
    text: "Vibrant and smooth artist paint offering superb coverage and blending capabilities for creative projects.",
  },
  {
    title: "EXTERIOR PRIMER",
    img: "exterior_primer.png",
    text: "High-adhesion exterior primer providing a perfect foundation and sealing for all exterior wall surfaces.",
  },
  {
    title: "EXTERIOR ECONOMIC EMULSION",
    img: "exterior_economic_emulsion.png",
    text: "Cost-effective exterior emulsion paint delivering reliable weather resistance and a neat, matte finish.",
  },
  {
    title: "EXTERIOR GLOSS EMULSION",
    img: "exterior_gloss_emulsion.png",
    text: "Premium exterior emulsion with a stunning glossy finish, ensuring long-lasting shine and superior protection.",
  },
  {
    title: "EXTERIOR LUXURY EMULSION",
    img: "exterior_luxury_emulsion.png",
    text: "Top-tier luxury emulsion offering unmatched durability, rich color depth, and an elegant smooth finish.",
  },
  {
    title: "ULTRA PREMIUM EMULSION",
    img: "ultra_premium_emulsion.png",
    text: "The ultimate internal/external emulsion providing advanced stain resistance, scrubbability, and pristine aesthetics.",
  },
  {
    title: "WATER PROOF EMULSION",
    img: "water_proof_emulsion.png",
    text: "Advanced waterproof emulsion formulated to block moisture and protect surfaces from extreme weather conditions.",
  },
];

function Services() {
  const handleAddToCart = async (colorName, productName, qty) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    const finalProductName = `${productName} - ${colorName}`;
    const quantity = Number(qty) || 1;

    try {
      const payload = {
        userId: user.id,
        orders: [{ productName: finalProductName, quantity }],
      };

      await axios.post(`${API_URL}/order/${user.id}`, payload, {
        headers: { "Authorization": token }
      });
      const isPigment = productName.toUpperCase().includes('PIGMENT');
      const unit = isPigment ? 'kg' : 'L';
      toast.success(`${finalProductName} (${quantity} ${unit}) added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart.");
    }
  };

  return (
    <div className="container services" style={{ paddingBottom: '50px' }}>
      <h2 className="main-title text-center" style={{ marginBottom: '30px' }}>PRODUCTS</h2>

      {/* All Products Grid — no dropdown */}
      <div className="product-grid">
        {allProducts.map((product) => (
          <div key={product.title}>
            <Card
              title={product.title}
              img={product.img}
              text={product.text}
              unit={product.title.toUpperCase().includes('PIGMENT') ? 'kg' : 'L'}
              onAddToCart={handleAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;

