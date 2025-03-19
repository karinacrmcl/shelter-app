import { Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/assets/hooks";
import { selectFavourites } from "../../store/assets/selectors";
import s from "./MatchNudge.module.scss";
import MatchDog from "../../shared/assets/MatchDog.svg";
import CardLayout from "../../shared/layouts/card/CardLayout";
import { useMatchDogMutation } from "../../store/api/dogApi";
import { DogInfoObj } from "../../shared/types/CardObj";
import { getAddressFromZip } from "../../shared/utils/mapsUtils";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery } from "react-responsive";

export default function MatchNudge() {
  const { favouriteDogIds, favouriteDogs } = useAppSelector(selectFavourites);
  const [findMatch] = useMatchDogMutation();
  const [open, setOpen] = useState(false);
  const [dog, setDog] = useState<DogInfoObj | undefined>(undefined);
  const [address, setAddress] = useState<string | null>(null);
  const isMobile = useMediaQuery({ maxWidth: "760px" });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!isMobile) return;

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!favouriteDogIds.length) return null;

  const handleFindMatch = () => {
    findMatch(favouriteDogIds)
      .unwrap()
      .then((r) => {
        setDog(favouriteDogs.find((d) => d.id === r.match));
        handleOpen();
      });
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (!dog?.zip_code) return;
      const fullAddress = await getAddressFromZip(dog.zip_code);
      setAddress(fullAddress);
    };

    fetchAddress();
  }, [dog]);

  return (
    <CardLayout className={s.container}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={s.modal}>
          <Button
            variant="outlined"
            className={s.close_btn}
            onClick={handleClose}
          >
            <CloseIcon />
          </Button>
          <div className={s.modal_content}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
              Your perfect match is - {dog?.name}!
            </Typography>
            <Typography
              className={s.modal_text}
              id="modal-modal-description"
              sx={{ mt: 2 }}
            >
              {dog?.name} is a {dog?.breed}.
              <br />
              She is{" "}
              {dog?.age || 0 < 1
                ? "only a few months old and full of energy!"
                : `currently ${dog?.age} years old and looking for a warm forever home.`}
              <br />
              <br />
              At the moment it is located in a shelter in {address}, waiting for
              you to pick it up!
            </Typography>
          </div>
          <img src={dog?.img} alt="preview" />
        </div>
      </Modal>
      <img src={MatchDog} alt="match-dog" />
      <div className={s.content}>
        <h3>Find the best companion! </h3>
        <p>
          Click the button to find a perfect match based on your favourites.
        </p>
      </div>
      <Button variant="contained" onClick={handleFindMatch}>
        Find a Match
      </Button>
    </CardLayout>
  );
}
