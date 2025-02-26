import React, { useState } from "react";
import {  AppBar,Toolbar,Card,Container, CardMedia, InputAdornment, TextField,CardContent, Typography, Grid, Modal, Box, Button } from "@mui/material";
import {  CalendarToday, AccessTime, LocationOn, Category, Description } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import peachImage from "../peach.jpg"; // Ensure correct path
import logo from "../logo.jpg"; // Replace with actual logo path

const events = [
  {
    id: 1,
    name: "Hiking Adventure",
    date: "2025-03-15",
    time: "08:00 AM",
    location: "Blue Ridge Mountains",
    description: "A thrilling hiking trip with breathtaking views and amazing people.",
    category: "Outdoor",
    image: "https://media-hosting.imagekit.io//8d1dbe7619c2465d/wandern-arten-text-media-header.jpg?Expires=1835217399&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=thaTbFslXPkxmgGQxfJZxCRK1-fQFJ1RQCLoJd4pF8s~QYmN0TWXs7wAci~QmXKa1NbE8YuLKESaOjLE3cL-DoPuVE58zOHgoW42FutngcosERqOHF1VdYpDqG4d8hP10tIeUPEzb81h4XDk1jvoJGe1c9J~pRrs0eRNQgGAcFFijF9WAC0YvhSKMW~XhUqB2ZXcea3OpwWjIygKAsdcuC8XEUFgZldaoF60cXEjqO2qWFahzTzCX~gmJ-q~62kgN8DHcSRA0JmhIgF-YtfKCt8eMsw70Q6famZZOwCUorVn2qBFxtnkoEW6TQs6TyE8GjbRRo6yWbL6RIv5VtL~Kg__",
  },
  {
    id: 2,
    name: "Tech Meetup",
    date: "2025-03-20",
    time: "06:00 PM",
    location: "Silicon Valley Hub",
    description: "Networking with top developers and tech enthusiasts.",
    category: "Tech",
    image: "https://media-hosting.imagekit.io//d8dae5098f0d43b3/59555265812165.jpg?Expires=1835217515&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=TU95Q2NGAKF~pD9ZnZ9cU08BYQGk2M6Fedb17Q~mKWsvl2sZmN16dCaD-Y0o7l0Ou8GCpTAUB0zEyEY7ScjySR4jxcwShLynve8tP~xk9VJZS6~U4jNeLEEgQed8TXhJARSepVrCALben~aooKBQ92yhNzB4aRCyhcFmSF1gPM6vyz~RJWZ-3ntmXG9KFxDVTvlm1eDDB6iyaBP1YQEU0LJiqNCsTXXPxZRIkUQiP2SEh7KQcfBqDjZarbq6tf1xMI0gcZGTwIn-QfsUcZWkipy94ZN9A5NpLXvLy4Mw~vBC0qSycV6bq28Ydvx~FNR81d56KvUYdvOXZQKpc-WZWw__",
  },
  {
    id: 3,
    name: "Pottery Workshop",
    date: "2025-03-25",
    time: "02:00 PM",
    location: "Art Studio Downtown",
    description: "Get your hands dirty and create your own pottery masterpiece!",
    category: "Arts & Crafts",
    image: "https://media-hosting.imagekit.io//b80f86a6541244cd/intro-to-pottery-1024x409.png?Expires=1835217701&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=nslhdp~nHog7-TKb7bXySj3VahW4~~T8j9lxtV2fktZk5OkVzsDxcOKpnbeFTq1eCL1s3DicBhREEI1C26cyDVDDNVQyMxTwgClVNY0EjG4wvR1yJk20m2ll56ulU08argXUU648K2PIgxafHcsA6MM8tC1W75MsD5qgplpMjxVXFZXQgGcduISBA-XUSVNe0Ba1n8ILGapBXfaaz-GYWSskdLzSyH1nxvEua0Oh8lpSBTYvIiWIVLcOubTKNS80QEwaXiTS3zPsPVSVW~D~l4weiPklJigDGW8wQ6wjOOeAFH4GxlRyLEeJOZCfrXj8B8oKeJOmBY67yjJ8Zpdg2g__",
  },
  {
    id: 4,
    name: "Cooking Class",
    date: "2025-04-02",
    time: "10:00 AM",
    location: "Culinary Arts Center",
    description: "Learn to cook delicious dishes with expert chefs.",
    category: "Food & Drink",
    image: "https://media-hosting.imagekit.io//70d81828e2b5425e/Basic-Cooking-Methods.jpg?Expires=1835217584&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=dvOYvJNmH90MD4aIVbKOhpc2exA6Qtp1guIOZq7Nszo~85EFKlax6xT5YtxQ~xSe0hLCrE0dx46QKSVmLo1vWuyPyLqnxC82p2s56MXYU4bsbh4G2LFvY8jsYSNq2e8j7Cn5YsIp4FIKflzNQT~-26iVgAs8E4MnP8Rmusfs7WelIuTXEGPk38vdbLxueJPV7SIWYXrXr7hi~WTjrTA2qoYqDcSjuO4jOjyUfps71w4mgI-qjWivAaMYA1EKRY6n4PVCCThOr8trFXvXsXAoutLTg4mWnAhXsG8O7Tbt66MUSo2XqadTlBvE~-~mVsBSMSzEAQFvuqc5dNqwlUyKFQ__",
  },
  {
    id: 5,
    name: "Yoga Retreat",
    date: "2025-04-05",
    time: "07:00 AM",
    location: "Serenity Hills",
    description: "A peaceful weekend of yoga, meditation, and relaxation.",
    category: "Wellness",
    image: "https://media-hosting.imagekit.io//ef5cacb755fc4061/Yoga-Blog-Cover-scaled-1-1024x576.jpg?Expires=1835218091&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=PrNxdRUWSe9qXFGlOju9vzL7egP-HWiITLzkTuRTPtvV~-sJT1tk~0GybJxpevZrJl~RdZbRGdp~A~t3wjLt-5am4j3PfBTT~TBRyD8kGjfDjQq3iNpSGAgWoi5wj-Di5QKrt97iQ~Sibs6yYA8qbe82qqH9GhDaAyidbPkV~RpHr~UCWbWk~OeI5fLupyOV-i2GgaTAZAALurrfHFBTd4PfN~T-k-vNQ7~atIZ8zSykqmakIuJmKjOkpr3y4byxNidFVlg~vr~rrbuB5tdnWHmkIrsYprg8Z8cvCWb3~ip-aUZZ7126usduwkHD9UP9oyUxgIdNvbCjEpFpKSa9-w__",
  },
  {
    id: 6,
    name: "Photography Workshop",
    date: "2025-04-10",
    time: "03:00 PM",
    location: "Photo Studio Downtown",
    description: "Enhance your photography skills with a hands-on workshop.",
    category: "Arts & Crafts",
    image: "https://media-hosting.imagekit.io//c800d5f9cdae4f16/10-tips-for-stunning-portrait-photography-6.jpg?Expires=1835218159&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=CKfk-xGSA8CdJJHgvNLI5ATxbY-HZlTms1ZKapuXWRvTxaZ8gklAMqsMmlb-tS7lzd~u1XQPMB2KdTTyDKaOZ-kF7k-rapekJqOfX0fnO6ZJo2YtY6TYlm7eLZ16an71JZJw2jRZxKLDSIr0lVrNlQd3HOv9uLH-XYMsC9m5C0758i3HDIve3JtTHytu-T0wx-aO4nVKu~CYBDyI-MVPqgTd5prXCOBI37MT78lr8P6ZNpJVQ8K1t2DLV9l4wZk3GnRQ3r2vLHmWEJioF76tZ6-M-aA2nNCYvB1diTlt4DO-UcLqaghJEiKtn-ZeQQgTk3LhFUk1zocj~-q~oAAoKA__",
  },
];
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="fixed" sx={{ background: "#89574c" }}>
      <Toolbar>
        <img
          src={logo}
          alt="Logo"
          style={{ height: "20px", marginRight: "20px" }}
        />
        <Typography variant="h9" sx={{ flexGrow: 1 }}>
          Connectify, Find Your People Today
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>
          Home
        </Button>
        <Button color="inherit" onClick={() => navigate("/about")}>
          About Us
        </Button>
        <Button color="inherit" onClick={() => navigate("/login")}>
          Log In
        </Button>
      </Toolbar>
    </AppBar>
  );
};
const ViewEvents = () => {
	
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 4, background: "#f7f3e9", minHeight: "100vh" }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#89574c" }}>
        Upcoming Events
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {events.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <Card sx={{ cursor: "pointer", boxShadow: 3, transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }} onClick={() => setSelectedEvent(event)}>
              <CardMedia
                component="img"
                height="200"
                image={event.image}
                alt={event.name}
                sx={{ objectFit: "cover", width: "100%" }}
              />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{event.name}</Typography>
                <Typography variant="body2" color="textSecondary">{event.location}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Event Details */}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        <Box sx={{ p: 4, background: "white", width: 400, margin: "auto", mt: 8, borderRadius: "10px", boxShadow: 3 }}>
          {selectedEvent && (
            <>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#89574c" }}>
                {selectedEvent.name}
              </Typography>
              <CardMedia
                component="img"
                height="250"
                image={selectedEvent.image}
                alt={selectedEvent.name}
                sx={{ objectFit: "contain", width: "100%", borderRadius: "10px", my: 2 }}
              />
              <Typography><CalendarToday /> {selectedEvent.date}</Typography>
              <Typography><AccessTime /> {selectedEvent.time}</Typography>
              <Typography><LocationOn /> {selectedEvent.location}</Typography>
              <Typography><Category /> {selectedEvent.category}</Typography>
              <Typography><Description /> {selectedEvent.description}</Typography>
              <Button onClick={() => setSelectedEvent(null)} sx={{ mt: 2, background: "#89574c", color: "white", "&:hover": { background: "#ae4040" } }}>Close</Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewEvents;
