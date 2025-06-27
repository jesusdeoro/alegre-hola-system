
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MenuButton = ({ icon: Icon, title, section, description, onClick }) => (
  <Card 
    className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
    onClick={() => onClick(section)}
  >
    <CardHeader className="text-center pb-3">
      <Icon className="mx-auto h-12 w-12 text-primary mb-2" />
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default MenuButton;
