const express = require('express');
const { check } = require('express-validator');

const jobsControllers = require('../controllers/jobs-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:jid', jobsControllers.getJobById);

router.get('/user/:uid', jobsControllers.getJobsByUserId);

router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    // check('address')
      // .not()
      // .isEmpty()
  ],
  jobsControllers.createdJob
);

router.patch(
  '/:jid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  jobsControllers.updateJob
);

router.delete('/:jid', jobsControllers.deleteJob);

module.exports = router;
