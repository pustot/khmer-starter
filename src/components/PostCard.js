import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function PostCard({image, alt, title, main, toLink}) {
    return (
        <Card onClick={()=>window.open(toLink)}> 
            <CardActionArea>
              <CardMedia
                component="img"
                image={image}
                alt={alt}
                height="200"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {main}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
    );
};