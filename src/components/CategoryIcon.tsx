import { GlassWater, Droplet, Wine, Beer, Martini, Anchor, LucideProps } from "lucide-react";
import { ProductCategory } from "@/types/product";

interface CategoryIconProps extends LucideProps {
  category: ProductCategory;
}

export function CategoryIcon({ category, ...props }: CategoryIconProps) {
  switch (category) {
    case "vodka":
      return <GlassWater {...props} />;
    case "whisky":
      return <Droplet {...props} />;
    case "wine":
      return <Wine {...props} />;
    case "beer":
      return <Beer {...props} />;
    case "liqueur":
      return <Martini {...props} />;
    case "rum":
      return <Anchor {...props} />;
    default:
      return null;
  }
}
