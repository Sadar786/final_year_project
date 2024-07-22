
import { Card, Dropdown } from "flowbite-react";
import { useNavigate } from "react-router-dom";
 
export default function ShopCard ({shop})  {
const navigate = useNavigate()

  const  goToStore = (shop) =>{
    navigate(`/showshop/${shop.slug}/${shop._id}`,{ state: { shops: shop } })
  }

  return (
    <Card className="max-w-sm">
      
      <div className="flex flex-col items-center pb-10">
        <img
          alt="Bonnie image"
          height="96"
          src={shop.image}
          width="96"
          className="mb-3 rounded-full shadow-lg"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{shop.title}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{shop.content}</span>
        <div className="mt-4 flex space-x-3 lg:mt-6">
          <button
          onClick={()=> goToStore(shop)}
            className="bg-gradient-to-r from-primary to-secondary
                    hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
          >
            Go to Store
          </button>
          
        </div>
      </div>
    </Card>
  );
}
